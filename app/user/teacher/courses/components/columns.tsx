'use client';

import { Button } from '@/components/ui/button';
import { Course } from '@prisma/client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash, Trash2 } from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Title
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
  },
  
  {
    accessorKey: 'isPublished',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Published
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const isPublished = row.getValue('isPublished') || false;
      return (
        <Badge className={cn('bg-slate-500', isPublished && 'bg-sky-700')}>
          {isPublished ? 'Published' : 'Draft'}
        </Badge>
      );
    },
  },
  {
    id: 'actions',
    header: () => null,
    cell: ({ row }) => {
      const { id } = row.original;
      const handleDelete = async () => {
        try {
          const res = await fetch(`/api/courses/${id}`, {
            method: 'DELETE',
          });
          if (res.ok) {
            toast.success(' Course deleted successfully'); 
            
            setTimeout(() => {
              window.location.reload(); // Or use router.refresh() if you're using Next.js router
            }, 2500);
          } else {
            toast.error('Failed to delete course');
          }
        } catch (error) {
          toast.error('Error deleting course');
        }
      };
      return (
        <div className="flex gap-4">
          <Link href={`/user/teacher/courses/${id}`} className='flex gap-2'>
            <Pencil className="w-4 h-4 cursor-pointer hover:opacity-75" />
            Edit details
          </Link>

          
      </div>
      );
    },
  },
];
