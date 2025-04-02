import { useState } from 'react';

interface Message {
  id: string;
  name: string;
  message: string;
  date: string;
  relation: string;
}

export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState({
    name: '',
    message: '',
    relation: 'Student' // Default relation
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message: Message = {
      id: Date.now().toString(),
      ...newMessage,
      date: new Date().toISOString()
    };
    setMessages([message, ...messages]);
    setNewMessage({ name: '', message: '', relation: 'Student' });
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Share Your Memories
      </h2>

      <form onSubmit={handleSubmit} className="mb-12 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              required
              value={newMessage.name}
              onChange={(e) => setNewMessage({ ...newMessage, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="relation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Your Relation
            </label>
            <select
              id="relation"
              value={newMessage.relation}
              onChange={(e) => setNewMessage({ ...newMessage, relation: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option>Student</option>
              <option>Colleague</option>
              <option>Friend</option>
              <option>Admirer</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Your Message
          </label>
          <textarea
            id="message"
            required
            rows={4}
            value={newMessage.message}
            onChange={(e) => setNewMessage({ ...newMessage, message: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            placeholder="Share your memories, thoughts, or tribute..."
          />
        </div>

        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
        >
          Share Memory
        </button>
      </form>

      <div className="space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {msg.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {msg.relation}
                </p>
              </div>
              <time className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(msg.date).toLocaleDateString()}
              </time>
            </div>
            <p className="text-gray-700 dark:text-gray-300">{msg.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 