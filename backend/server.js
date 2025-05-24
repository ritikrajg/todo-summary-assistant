const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');
const axios = require('axios');
const path = require('path');


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors({
  origin: 'https://todo-summary-assistant-i548.onrender.com'  // Replace with your frontend URL
}));
// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to generate a simple summary
const generateSimpleSummary = (todos) => {
  const totalTodos = todos.length;
  const todoList = todos.map(todo => `- ${todo.title}: ${todo.description}`).join('\n');
  return `Summary of ${totalTodos} pending todo items:\n\n${todoList}`;
};

// Routes
app.get('/api/todos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/todos', async (req, res) => {
  try {
    const { title, description } = req.body;
    const { data, error } = await supabase
      .from('todos')
      .insert([{ title, description, completed: false }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/summarize', async (req, res) => {
  try {
    console.log('Starting summarize process...');
    
    // Fetch all pending todos
    const { data: todos, error: supabaseError } = await supabase
      .from('todos')
      .select('*')
      .eq('completed', false);

    if (supabaseError) {
      console.error('Supabase error:', supabaseError);
      throw supabaseError;
    }

    console.log('Fetched todos:', todos);

    if (!todos || todos.length === 0) {
      return res.json({ message: 'No pending todos to summarize' });
    }

    let summary;
    try {
      // Try to generate summary using OpenAI
      const prompt = `Please provide a concise summary of the following todo items:\n${todos
        .map((todo) => `- ${todo.title}: ${todo.description}`)
        .join('\n')}`;

      console.log('Sending prompt to OpenAI:', prompt);

      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      });

      console.log('Received completion from OpenAI:', completion);
      summary = completion.choices[0].message.content;
    } catch (openaiError) {
      console.error('OpenAI error:', openaiError);
      // If OpenAI fails, generate a simple summary
      summary = generateSimpleSummary(todos);
      console.log('Using fallback summary:', summary);
    }

    // Send to Slack
    console.log('Sending to Slack...');
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: `📋 *Todo Summary*\n\n${summary}`,
    });

    console.log('Successfully sent to Slack');
    res.json({ 
      message: 'Summary sent to Slack successfully',
      usedFallback: !summary.includes('OpenAI')
    });
  } catch (error) {
    console.error('Error in summarize endpoint:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || error.stack
    });
  }
});
if (process.env.NODE_ENV === "production") {
  const dirPath = path.resolve();
  app.use(express.static("./frontend/dist"))
  app.get("*",(req,res)=>{
    res.sendFile(path.resolve(dirPath,"./frontend/dist","index.html"))
  })
}
// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 