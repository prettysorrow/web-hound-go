import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function WebHoundAdminPanel() {
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
