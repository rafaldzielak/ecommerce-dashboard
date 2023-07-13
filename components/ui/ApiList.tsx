"use client";

import { useOrigin } from "@/hooks/useOrigin";
import { useParams } from "next/navigation";
import React, { FC } from "react";
import ApiAlert from "./ApiAlert";

interface ApiListProps {
  entityName: string;
  entityIdName: string;
}

export const ApiList: FC<ApiListProps> = ({ entityIdName, entityName }) => {
  const params = useParams();
  const origin = useOrigin();

  const baseUrl = `${origin}/api/${params.storeId}`;

  return (
    <>
      <ApiAlert title='GET' variant='public' description={`${baseUrl}/${entityName}`} />
      <ApiAlert title='GET' variant='public' description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
      <ApiAlert title='POST' variant='admin' description={`${baseUrl}/${entityName}`} />
      <ApiAlert title='PATCH' variant='admin' description={`${baseUrl}/${entityName}/{${entityIdName}}`} />
    </>
  );
};
