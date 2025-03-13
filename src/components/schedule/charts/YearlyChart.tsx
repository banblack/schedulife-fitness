
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { EmptyChartState } from "./EmptyChartState";

interface YearlyChartProps {
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

export function YearlyChart({ data, colors }: YearlyChartProps) {
  if (data.length === 0) {
    return <EmptyChartState />;
  }
  
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorWorkouts" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.workouts} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={colors.workouts} stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.duration} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={colors.duration} stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="colorIntensity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.intensity} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={colors.intensity} stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis dataKey="name" stroke={colors.text} tick={{ fill: colors.text }} />
        <YAxis yAxisId="left" orientation="left" stroke={colors.workouts} tick={{ fill: colors.text }} />
        <YAxis yAxisId="right" orientation="right" stroke={colors.duration} tick={{ fill: colors.text }} />
        <Tooltip 
          contentStyle={{ backgroundColor: colors.tooltip, borderColor: colors.grid }}
          labelStyle={{ color: colors.text }}
        />
        <Legend 
          wrapperStyle={{ color: colors.text }}
        />
        <Area 
          yAxisId="left" 
          type="monotone" 
          dataKey="workouts" 
          name="Workouts" 
          stroke={colors.workouts} 
          fillOpacity={1} 
          fill="url(#colorWorkouts)" 
        />
        <Area 
          yAxisId="right" 
          type="monotone" 
          dataKey="duration" 
          name="Avg Duration (min)"
          stroke={colors.duration} 
          fillOpacity={1}
          fill="url(#colorDuration)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
