import { WithActualResults } from "@/searching/with-actual-results";
import { GitHubSocialGraph, InstagramSocialGraph } from "./convert";
import { WebHoundSearch } from "@/searching/search";
import { useWebHoundSearchingStore } from "@/searching/store";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { create } from "zustand";
import { GitHubResults } from "@/entities/github";
import { InstagramResults } from "@/entities/instagram";

type WebHoundStore___SearchingTextbox = {
  visible: boolean;
  setVisible(value: boolean): void;
};

const useSearchingTextbox = create<WebHoundStore___SearchingTextbox>((set) => ({
  visible: true,
  setVisible: (value) => set((state) => ({ ...state, visible: value })),
}));

type WebHoundStore___MenuPanel = {
  searchButton: { visible: boolean; setVisible(value: boolean): void };
  details: { visible: boolean; setVisible(value: boolean): void };
};

const useMenuPanelState = create<WebHoundStore___MenuPanel>((set) => ({
  searchButton: {
    visible: false,
    setVisible: (value) =>
      set((state) => ({ ...state, searchButton: { ...state.searchButton, visible: value } })),
  },
  details: {
    visible: false,
    setVisible: (value) =>
      set((state) => ({ ...state, details: { ...state.details, visible: value } })),
  },
}));

function MenuPanel() {
  const { searchButton, details } = useMenuPanelState();
  const searchTextbox = useSearchingTextbox();

  function SearchButton() {
    if (!searchButton.visible) {
      return <></>;
    }

    return (
      <Button
        className="w-30"
        onClick={() => {
          searchTextbox.setVisible(true);
          searchButton.setVisible(false);
        }}
      >
        Search
      </Button>
    );
  }

  function DetailsButton() {
    return (
      <Button
        className="w-30"
        onClick={() => {
          details.setVisible(true);
        }}
      >
        Details
      </Button>
    );
  }

  return (
    <div className="w-40 p-4 bg-white rounded border-2 border-black mb-4 pointer-events-auto">
      <div>Menu</div>
      <DetailsButton />
      <SearchButton />
    </div>
  );
}

function DetailsWindow() {
  const { visible, setVisible } = useMenuPanelState().details;

  if (!visible) {
    return <></>;
  }

  return (
    <div className=" fixed w-full h-full top-0 left-0 flex justify-center items-center bg-black/50">
      <div className="bg-white w-1/3 p-5">
        <div className="flex justify-end">
          <Button onClick={() => setVisible(false)}>Close</Button>
        </div>
        <div>
          <GitHubResults />
          <InstagramResults />
        </div>
      </div>
    </div>
  );
}

function SearchingTextbox() {
  const { username, setUsername } = useWebHoundSearchingStore();
  const [textboxState, setTextboxState] = useState(username || "");
  const textbox = useSearchingTextbox();
  const button = useMenuPanelState().searchButton;

  if (!textbox.visible) {
    return <></>;
  }

  function SearchButton() {
    if (username === textboxState) {
      return <></>;
    }
    return <Button onClick={() => setUsername(textboxState)}>Search</Button>;
  }

  return (
    <div className="w-200 h-25 p-4 bg-white rounded border-2 border-black mb-4 pointer-events-auto">
      <div className="flex flex-row gap-2 h-full items-center">
        <Input
          type="textbox"
          placeholder="Enter username..."
          value={textboxState}
          onChange={(e) => setTextboxState(e.target.value)}
        />
        <SearchButton />
        <Button
          onClick={() => {
            textbox.setVisible(false);
            button.setVisible(true);
          }}
          variant={"outline"}
        >
          Hide
        </Button>
      </div>
    </div>
  );
}

export function WebHoundSocialGraphs() {
  const { username } = useWebHoundSearchingStore();
  if (username === undefined) {
    return <WebHoundSearch />;
  }
  return (
    <WithActualResults>
      <div className="flex flex-col gap-4 items-center">
        <div className="p-4 rounded bg-black/10">
          <GitHubSocialGraph />
        </div>
        <div className="p-4 rounded bg-black/10">
          <InstagramSocialGraph />
        </div>
      </div>
      <div className="fixed w-full h-full top-0 left-0 flex flex-row justify-center items-end pointer-events-none">
        <SearchingTextbox />
      </div>
      <div className="fixed w-full h-full top-0 left-0 flex flex-row justify-start items-center pointer-events-none">
        <MenuPanel />
      </div>
      <DetailsWindow />
    </WithActualResults>
  );
}
