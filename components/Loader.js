export default function Loader({ show }) {
  return show ? (
    <div className="h-24 w-24 animate-spin rounded-full border-4 border-white border-t-blue-900"></div>
  ) : null;
}
