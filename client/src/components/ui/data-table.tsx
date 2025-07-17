import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LoadingState } from "./loading-spinner";
import { EmptyState } from "./empty-state";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T | 'actions';
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  emptyState?: {
    title: string;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  isLoading = false,
  emptyState = { title: "No data available" },
  className,
}: DataTableProps<T>) {
  if (isLoading) {
    return <LoadingState message="Loading data..." />;
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyState.title}
        description={emptyState.description}
        action={emptyState.action}
        className="py-8"
      />
    );
  }

  return (
    <div className={cn("rounded-md border", className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)} className={column.className}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={item.id || index}>
              {columns.map((column) => (
                <TableCell key={String(column.key)} className={column.className}>
                  {column.render ? column.render(item) : item[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}