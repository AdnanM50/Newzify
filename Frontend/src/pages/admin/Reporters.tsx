import { useState } from "react";
import { useFetch, useAction } from "../../helpers/hooks";
import { fetchUserList, createReporter, deleteUser, resetUserPassword } from "../../helpers/backend";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "../../components/ui/dialog";
import { 
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage 
} from "../../components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  UserPlus, Trash2, Key, Briefcase, Search, MoreHorizontal, User as UserIcon, Mail, Phone 
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "../../components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";

const reporterSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  work_experience: z.string().optional(),
});

type ReporterFormValues = z.infer<typeof reporterSchema>;

const Reporters = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [resetPassword, setResetPassword] = useState("");

  const { data: reportersData, refetch, isLoading } = useFetch("reporters", fetchUserList, {
    role: "reporter"
  });

  const { mutate: addReporter, isLoading: isCreating } = useAction(createReporter, {
    onSuccess: () => {
      setIsCreateModalOpen(false);
      refetch();
    },
    successMessage: "Reporter created successfully",
  });

  const { mutate: removeUser } = useAction(deleteUser, {
    onSuccess: () => refetch(),
    successMessage: "Reporter deleted successfully",
  });

  const { mutate: resetPwd } = useAction(resetUserPassword, {
    onSuccess: () => {
      setIsResetModalOpen(false);
      setResetPassword("");
      setSelectedUser(null);
    },
    successMessage: "Password reset successfully",
  });

  const form = useForm<ReporterFormValues>({
    resolver: zodResolver(reporterSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      work_experience: "",
    },
  });

  const onSubmit = (data: ReporterFormValues) => {
    addReporter({ body: data } as any);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this reporter?")) {
      removeUser({ params: { id } } as any);
    }
  };

  const handleResetPassword = () => {
    if (selectedUser && resetPassword) {
      resetPwd({ body: { userId: selectedUser._id, newPassword: resetPassword } } as any);
    }
  };

  const reporters = reportersData?.docs || [];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reporters</h1>
          <p className="text-muted-foreground">Manage your news reporters and their accounts.</p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <UserPlus className="mr-2 h-4 w-4" />
              Add Reporter
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Reporter</DialogTitle>
              <DialogDescription>
                Add a new reporter to your team. They will be able to log in with these credentials.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 234 567 890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Initial Password</FormLabel>
                      <FormControl>
                        <Input placeholder="Minimum 6 characters" type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="work_experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Experience</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 5 years in investigative journalism" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="pt-4">
                  <Button type="submit" disabled={isCreating} className="bg-indigo-600">
                    {isCreating ? "Creating..." : "Create Reporter"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Reporter List</CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search reporters..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : reporters.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No reporters found.
                    </TableCell>
                  </TableRow>
                ) : (
                  reporters.map((reporter: any) => (
                    <TableRow key={reporter._id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <UserIcon className="w-4 h-4 text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-medium">{reporter.first_name} {reporter.last_name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{reporter.role}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Mail className="w-3 h-3 mr-1" />
                            {reporter.email}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Phone className="w-3 h-3 mr-1" />
                            {reporter.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {reporter.work_experience ? (
                          <div className="flex items-center text-sm">
                            <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="truncate max-w-[200px]">{reporter.work_experience}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No details</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                              setSelectedUser(reporter);
                              setIsResetModalOpen(true);
                            }}>
                              <Key className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600" 
                              onClick={() => handleDelete(reporter._id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Reporter
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isResetModalOpen} onOpenChange={setIsResetModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter a new password for {selectedUser?.first_name} {selectedUser?.last_name}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input 
              type="password" 
              placeholder="New password" 
              value={resetPassword}
              onChange={(e) => setResetPassword(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetModalOpen(false)}>Cancel</Button>
            <Button 
              className="bg-indigo-600" 
              onClick={handleResetPassword}
              disabled={!resetPassword || resetPassword.length < 6}
            >
              Reset Password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reporters;
