import { HashLoader } from 'react-spinners';

export function Loader() {
  return (
    <div className="grid place-items-center h-full">
      <HashLoader size={100} />
    </div>
  );
}
