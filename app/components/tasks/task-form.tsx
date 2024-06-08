'use client'
import { useState } from 'react';
import { createTask, updateTask, deleteTask } from '@/app/lib/actions';
import { mockEmail } from '@/app/data/mock-data';
import { Button } from '@/app/components/button';

export default function TaskForm () {
  const [isRepeatable, setIsRepeatable] = useState(false);
  return (
    <>
    <form action={createTask}>
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder='Add a title for the task'
          required
        />
      </div>

      <div>
        <label htmlFor="description">Description:</label><br/>
        <textarea
          id="description"
          name="description"
          placeholder='Add a description for the task'
        />
      </div>

      <div>
        <label htmlFor="task">Task:</label><br/>
        <input
          type="text"
          id="task"
          name="task"
          placeholder='e.g. is:unread older_than:3m'
          required
        />
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="isRepeatable"
            checked={isRepeatable}
            onChange={() => setIsRepeatable(!isRepeatable)}
          />
          Repeatable
        </label>
      </div>

      {isRepeatable && (
        <div>
          <label htmlFor="repeatInterval">Repeat Interval:</label><br/>
          <input
            type="text"
            id="repeatInterval"
            name="repeatInterval"
            placeholder='e.g. 3m, 1h, 1d'
          />
        </div>
      )}

      {/* Hidden Emil field */}
      <input
        type="hidden"
        name="email"
        value={mockEmail}
      />

      <Button type="submit">Create Task</Button>
    </form>
    <form action={updateTask}>
      <Button type="submit">Update Task</Button>
    </form>
    <Button onClick={() => deleteTask("123")}>Delete Task</Button>
    </>
  );
};