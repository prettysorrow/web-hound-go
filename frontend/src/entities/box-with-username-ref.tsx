import { useWebHoundSearchingStore } from "@/searching/store";

// todo : change name
export function BoxWithUsernameRef(props: { to: string; children: React.ReactElement }) {
  const { setUsername } = useWebHoundSearchingStore();
  return (
    <div
      className="bg-black/10 px-2 py-2 rounded cursor-pointer"
      onClick={() => setUsername(props.to)}
    >
      {props.children}
    </div>
  );
}
