import { Button } from "@/components/ui/button";
import { InstagramResults } from "../entities/instagram";
import { GitHubResults } from "../entities/github";
import { WithActualResults } from "./with-actual-results";

export function SearchingResults(props: {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  function ResultsWindow(_props: { children: React.ReactNode }): React.ReactNode {
    return (
      <div className="bg-black/50 w-full h-full fixed top-0 left-0 flex justify-center items-center">
        <div className="bg-white w-1/3 p-5">
          <div className="flex justify-end">
            <Button onClick={() => props.setActive(false)}>Close</Button>
          </div>
          <div>{_props.children}</div>
        </div>
      </div>
    );
  }

  if (!props.active) {
    return <></>;
  }

  return (
    <WithActualResults>
      <ResultsWindow>
        <GitHubResults />
        <InstagramResults />
      </ResultsWindow>
    </WithActualResults>
  );
}
