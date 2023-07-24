"use client";

import { GraphData } from "@/actions/getGraphRevenue";
import React, { FC } from "react";
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar } from "recharts";

interface OverviewProps {
  data: GraphData[];
}

const Overview: FC<OverviewProps> = ({ data }) => {
  return (
    <ResponsiveContainer width='100%' height={300}>
      <BarChart data={data}>
        <XAxis dataKey='name' stroke='#888888' fontSize={12} tickLine={false} axisLine={false}></XAxis>
        <YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`}></YAxis>
        <Bar dataKey='total' fill='#3498db' radius={[4, 4, 0, 0]}></Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Overview;
