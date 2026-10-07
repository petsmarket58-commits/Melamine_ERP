import type { Metadata } from "next"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const metadata: Metadata = { title: "Accept invitation" }

export default function InvitePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accept invitation</CardTitle>
        <CardDescription>Set your password to join your company workspace.</CardDescription>
      </CardHeader>
    </Card>
  )
}
