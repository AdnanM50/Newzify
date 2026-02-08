"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  HeaderGroup,
  Header,
  Row,
  Cell,
} from "@tanstack/react-table";
import { Search } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  onAdd?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filterOptions?: { label: string; value: string }[];
  addButtonLabel?: string;
}

export function PrimaryTable<TData, TValue>({
  columns,
  data,
  title = "List",
  onAdd,
  searchValue,
  onSearchChange,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = React.useState(searchValue || "");

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: (value: string) => {
      setGlobalFilter(value);
      onSearchChange?.(value);
    },
  });

  const paginationState = table.getState().pagination;

  return (
    <div className="w-full space-y-4">
      {/* Page Title */}
      <h2 className="text-xl font-bold text-[#003049] mb-4">{title} List</h2>
      
      <div className="bg-white rounded-md border shadow-sm p-4 space-y-4">
        {/* Search and Add Button Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search"
              value={globalFilter ?? ""}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const value = event.target.value;
                setGlobalFilter(value);
                onSearchChange?.(value);
              }}
              className="pl-10 h-10 border-gray-200 focus-visible:ring-1 focus-visible:ring-gray-300 rounded-md"
            />
          </div>
          {onAdd && (
            <Button 
              onClick={onAdd}
              className="bg-white text-[#d35400] border border-[#d35400] hover:bg-[#d35400] hover:text-white h-10 px-4 font-semibold transition-colors rounded-md"
            >
              Add {title.replace(/s$/, '')}
            </Button>
          )}
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto custom-scrollbar border rounded-sm">
          <Table className="min-w-full border-collapse">
            <TableHeader className="bg-white border-y border-gray-100">
              {table.getHeaderGroups().map((headerGroup: HeaderGroup<TData>) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-none">
                  {headerGroup.headers.map((header: Header<TData, unknown>) => (
                    <TableHead 
                      key={header.id}
                      className="text-[11px] font-bold uppercase text-gray-400 h-12 px-4 border-none whitespace-nowrap"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row: Row<TData>) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                      <TableCell key={cell.id} className="py-4 px-4 text-[13px] text-gray-600 font-medium whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          .custom-scrollbar::-webkit-scrollbar {
            height: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #ccc;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #999;
          }
        `}} />

        {/* Footer / Pagination */}
        <div className="flex flex-wrap items-center justify-between pt-4 gap-4">
          <div className="flex items-center gap-2 text-[13px] text-gray-700">
            <span>Show</span>
            <div className="flex items-center border border-gray-200 rounded px-1">
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value: string) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-7 w-[45px] border-none shadow-none font-semibold p-0 focus:ring-0">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <span className="ml-2">
              Showing {paginationState.pageIndex * paginationState.pageSize + 1} to{" "}
              {Math.min(
                (paginationState.pageIndex + 1) * paginationState.pageSize,
                data.length
              )}{" "}
              of {data.length} entries
            </span>
          </div>

          <div className="flex items-center border border-[#001f3f] rounded-md overflow-hidden bg-[#001f3f]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="text-white hover:bg-[#002b55] hover:text-white disabled:opacity-50 h-9 px-4 rounded-none font-semibold"
            >
              Previous
            </Button>
            {Array.from({ length: table.getPageCount() }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="ghost"
                size="sm"
                onClick={() => table.setPageIndex(page - 1)}
                className={`h-9 px-4 rounded-none font-bold border-l border-[#ffffff20] ${
                  table.getState().pagination.pageIndex + 1 === page 
                  ? "bg-white text-[#001f3f] hover:bg-white/90" 
                  : "text-white hover:bg-[#002b55]"
                }`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="text-white hover:bg-[#002b55] hover:text-white disabled:opacity-50 h-9 px-4 rounded-none border-l border-[#ffffff20] font-semibold"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
