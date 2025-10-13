import { Link } from 'react-router';

export default function NotFound() {
  return (
    <>
      <div>page not found</div>
      <Link to={'/'}>go back home</Link>
    </>
  );
}
