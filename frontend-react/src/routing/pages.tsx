import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import { useState } from "react";

export function FirstPage() {
  return <h1>First Page Content</h1>;
}

export function SecondPage() {
  return <h1>Second Page Content</h1>;
}

export function PageWithUI() {
  const [cnt, setCnt] = useState(0);
  return (
    <Card>
      <Badge variant={"default"}>Counter: {cnt}</Badge>
      <Button onClick={() => setCnt((cnt) => cnt + 1)}>Increment</Button>
      <Button onClick={() => setCnt((cnt) => cnt - 1)}>Decrement</Button>
    </Card>
  );
}
