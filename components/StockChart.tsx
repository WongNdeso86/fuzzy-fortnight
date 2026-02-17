"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function StockChart({ data }: { data: { week: number; price: number }[] }) {
  return <div className="h-48 w-full"><ResponsiveContainer><LineChart data={data}><XAxis dataKey="week"/><YAxis/><Tooltip/><Line type="monotone" dataKey="price" stroke="#10b981" dot={false}/></LineChart></ResponsiveContainer></div>;
}
