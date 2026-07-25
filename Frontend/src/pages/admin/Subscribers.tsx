import { useFetch, useDelete } from "../../helpers/hooks";
import { getSubscribersList, deleteSubscriber } from "../../helpers/backend";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Trash2, Search, Mail, Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { useState, useEffect } from "react";

const Subscribers = () => {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: subscribersData, isLoading } = useFetch<any>("subscribers", getSubscribersList, { search: search || undefined });

  const { mutate: deleteSub } = useDelete(deleteSubscriber, {
    invalidateKeys: ["subscribers"],
    successMessage: "Subscriber deleted successfully",
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this subscriber?")) {
      deleteSub({ _id: id });
    }
  };

  const subscribers = subscribersData?.docs || [];
  const totalSubscribers = subscribersData?.totalDocs || 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
          <p className="text-muted-foreground">Manage your email subscriber list.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalSubscribers}</p>
                <p className="text-sm text-muted-foreground">Total Subscribers</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subscriber List</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email..."
                className="pl-8"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email Address</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscribed Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Loading subscribers...
                    </TableCell>
                  </TableRow>
                ) : subscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No subscribers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  subscribers.map((subscriber: any) => (
                    <TableRow key={subscriber._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                            <Mail className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="font-medium">{subscriber.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                          Active
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="w-4 h-4 mr-2" />
                          {new Date(subscriber.createdAt).toLocaleDateString("en-US", {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(subscriber._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscribers;
