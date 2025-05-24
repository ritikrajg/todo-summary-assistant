import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

const API_URL = 'https://todo-summary-assistant-i548.onrender.com' || 'http://localhost:5000';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/todos`);
      setTodos(response.data);
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error fetching todos', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/todos`, newTodo);
      setNewTodo({ title: '', description: '' });
      fetchTodos();
      showMessage('Todo added successfully', 'success');
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error adding todo', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/todos/${id}`);
      fetchTodos();
      showMessage('Todo deleted successfully', 'success');
    } catch (error) {
      showMessage(error.response?.data?.error || 'Error deleting todo', 'error');
    }
  };

  const handleSummarize = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/summarize`, {
        method: 'POST',
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate summary');
      }
      
      showMessage(
        data.usedFallback 
          ? 'Summary sent to Slack (using basic summary due to API limitations)'
          : 'Summary sent to Slack successfully',
        'success'
      );
    } catch (error) {
      console.error('Error generating summary:', error);
      showMessage(
        error.message || 'Failed to generate summary. Please try again.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1 className="text-3xl font-bold text-center mb-8">Todo Summary Assistant</h1>
                
                {/* Message Display */}
                {message.text && (
                  <div className={`p-4 mb-4 rounded ${
                    message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {message.text}
                  </div>
                )}

                {/* Add Todo Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Todo title"
                      value={newTodo.title}
                      onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Description"
                      value={newTodo.description}
                      onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Add Todo
                  </button>
                </form>

                {/* Todo List */}
                <div className="mt-8 space-y-4">
                  {todos.map((todo) => (
                    <div key={todo.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">{todo.title}</h3>
                        <p className="text-sm text-gray-600">{todo.description}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Summarize Button */}
                <button
                  onClick={handleSummarize}
                  disabled={isLoading}
                  className={`w-full mt-8 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                    isLoading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                >
                  {isLoading ? 'Generating Summary...' : 'Generate & Send Summary to Slack'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App; 