"use client"

import { useTheme } from "next-themes"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { format } from "date-fns"

interface DashboardChartProps {
  data: any[]
}

export default function DashboardChart({ data }: DashboardChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Format data for the chart
  const formattedData = data.map((item) => ({
    name: format(new Date(item.timestamp), "HH:mm"),
    cpu: (item.cpu * 100).toFixed(2),
    memory: (item.memory * 100).toFixed(2),
    requests: item.requests,
    errors: item.errors,
  }))

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
          <XAxis dataKey="name" stroke={isDark ? "#888" : "#666"} tick={{ fill: isDark ? "#888" : "#666" }} />
          <YAxis stroke={isDark ? "#888" : "#666"} tick={{ fill: isDark ? "#888" : "#666" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#333" : "#fff",
              borderColor: isDark ? "#444" : "#ddd",
              color: isDark ? "#fff" : "#333",
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="cpu" name="CPU (%)" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} />
          <Line type="monotone" dataKey="memory" name="Memory (%)" stroke="hsl(var(--orange))" />
          <Line type="monotone" dataKey="requests" name="Requests" stroke={isDark ? "#8884d8" : "#8884d8"} />
          <Line type="monotone" dataKey="errors" name="Errors" stroke={isDark ? "#ff5252" : "#ff5252"} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
