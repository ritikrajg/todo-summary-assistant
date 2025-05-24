# Todo Summary Assistant

A full-stack application that helps users manage their todos and automatically generates summaries using AI. The application includes Slack notifications for important updates.

## Features

- Create, read, update, and delete todos
- AI-powered summary generation using OpenAI
- Slack notifications for important updates
- Modern React frontend with Tailwind CSS
- Secure backend with Supabase integration
- Real-time updates

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Axios for API calls

### Backend
- Node.js with Express
- Supabase for database
- OpenAI API for AI features
- Slack API for notifications

## Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- Supabase account
- OpenAI API key
- Slack workspace with app integration

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
SLACK_WEBHOOK_URL=your_slack_webhook_url
```

## Project Structure

```
todo-summary-assistant/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── schema.sql
│   └── frontend/          # Built frontend files
├── README.md
└── .env
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd todo-summary-assistant
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Set up the database:
   - Create a new Supabase project
   - Run the SQL commands from `schema.sql` in your Supabase SQL editor

4. Configure environment variables:
   - Copy the `.env.example` file to `.env`
   - Fill in your Supabase, OpenAI, and Slack credentials

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `POST /api/summarize` - Generate a summary of todos

## Database Schema

The application uses the following tables in Supabase:

- `todos`: Stores todo items with fields for title, description, status, and timestamps
- `summaries`: Stores generated summaries with references to related todos

## Security

- Row Level Security (RLS) is enabled in Supabase
- API endpoints are protected with proper authentication
- Environment variables are used for sensitive credentials

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 