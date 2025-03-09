
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Clock, 
  BarChart, 
  Flame,
  Loader2
} from "lucide-react";
import { formatDistance } from "date-fns";
import { workoutLogService } from "@/services/workoutLog";
import { WorkoutLog } from "@/types/workout";

export function WorkoutHistory() {
  const [page, setPage] = useState(0);
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  const pageSize = 5;
  const totalPages = Math.ceil(logs.length / pageSize);
  
  const paginatedLogs = logs.slice(page * pageSize, (page + 1) * pageSize);
  
  useEffect(() => {
    const fetchWorkoutLogs = async () => {
      setLoading(true);
      try {
        const workoutLogs = await workoutLogService.getUserWorkoutLogs();
        setLogs(workoutLogs);
      } catch (error) {
        console.error("Error fetching workout logs:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkoutLogs();
  }, []);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Recent Workouts
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0 || loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {page + 1} of {Math.max(1, totalPages)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1 || loading || logs.length === 0}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : paginatedLogs.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workout</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Intensity</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.workoutName}</TableCell>
                  <TableCell>{formatDistance(new Date(log.date), new Date(), { addSuffix: true })}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {log.duration} min
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Flame className="h-3 w-3 text-orange-500" />
                      <div className="w-24 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-primary h-2.5 rounded-full" 
                          style={{ width: `${(log.intensity / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{log.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="p-8 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Calendar className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-lg mb-1">No workout history</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Complete your first workout to start tracking your progress.
          </p>
        </div>
      )}
    </div>
  );
}
