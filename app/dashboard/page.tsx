'use client';

import { usePathname } from 'next/navigation';
export default function Page() {
  const param = usePathname();
  console.log(param, 'param');
  return <p>Dashboard Page</p>;
}
