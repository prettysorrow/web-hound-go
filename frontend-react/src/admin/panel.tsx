import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WebHoundUsers, WebHoundRequests } from "../components/entities/webhound";
import { useWebHoundFetching } from "@/hooks/useFetching";

export function WebHoundAdminPanel() {
  let data = useWebHoundFetching();

  return (
    <Tabs>
      <TabsList>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="requests">Requests</TabsTrigger>
        <TabsTrigger value="statistics">Statistics</TabsTrigger>
      </TabsList>
      <TabsContent value={"users"}></TabsContent>
      <TabsContent value={"requests"}></TabsContent>
      <TabsContent value={"statistics"}>
        <div>some statistics</div>
      </TabsContent>
    </Tabs>
  );
}
