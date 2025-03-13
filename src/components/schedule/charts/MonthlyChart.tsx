
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyChartState } from "./EmptyChartState";

interface MonthlyChartProps {
  data: any[];
  colors: {
    workouts: string;
    duration: string;
    intensity: string;
    grid: string;
    tooltip: string;
    text: string;
  };
}

export function MonthlyChart({ data, colors }: MonthlyChartProps) {
  if (data.length === 0) {
    return <EmptyChartState />;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} stroke={colors.grid} />
        <XAxis dataKey="name" tick={{ fill: colors.text }} />
        <YAxis yAxisId="left" orientation="left" stroke={colors.workouts} tick={{ fill: colors.text }} />
        <YAxis yAxisId="right" orientation="right" stroke={colors.duration} tick={{ fill: colors.text }} />
        <Tooltip 
          contentStyle={{ backgroundColor: colors.tooltip, borderColor: colors.grid }}
          labelStyle={{ color: colors.text }}
        />
        <Legend 
          wrapperStyle={{ color: colors.text }}
        />
        <Bar 
          yAxisId="left" 
          dataKey="workouts" 
          name="Workouts" 
          fill={colors.workouts} 
          radius={[4, 4, 0, 0]} 
        />
        <Bar 
          yAxisId="right" 
          dataKey="duration" 
          name="Avg Duration (min)" 
          fill={colors.duration} 
          radius={[4, 4, 0, 0]} 
        />
        <Bar 
          yAxisId="left" 
          dataKey="intensity" 
          name="Avg Intensity" 
          fill={colors.intensity} 
          radius={[4, 4, 0, 0]} 
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
