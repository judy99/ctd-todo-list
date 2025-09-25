export default function About() {
  return (
    <>
      <p>
        This application is a lightweight tool designed to help users manage
        their daily tasks. It allows users to do the following:
      </p>
      <ul>
        <li>Add Task: Users can add new todos with a title.</li>
        <li>
          Mark as Completed: Tasks can be marked as done - these tasks will be
          removed from the active items.
        </li>
        <li>
          Edit Task: Users can update existing tasks to correct or change their
          title.
        </li>
        <li>Filter by "Title"</li>
        <li>Sort by "Title" and "Time Added"</li>
      </ul>
    </>
  );
}
