import TaskForm from "./components/tasks/create-form";
import TaskTable from "./components/tasks/table";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <h1 className="text-4xl font-bold text-center">Gmail Cleaner</h1>
        <p className="text-center">
          The best app for cleaning up your Gmail inbox.
        </p>
        <TaskForm />
        <br/>
        <TaskTable />
      </div>
    </main>
  );
}
