import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Overview } from './_components/overview'
import { RaceResult } from './_components/race-result'
import CardRaceDetails from './_components/card-race-details'
import { getLastRace } from './actions'
import CardStatistics from './_components/card-statistics'
import { GenerateNewRaceDialog } from './_components/generate-new-race-dialog'

export default async function DashboardPage() {
  const race = await getLastRace()

  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <GenerateNewRaceDialog>
                <Button>Generate New Race</Button>
              </GenerateNewRaceDialog>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-3">
            <CardRaceDetails data={race} />
            <CardStatistics data={race} />
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <Overview />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Race Results</CardTitle>
                <CardDescription>Results of the last race</CardDescription>
              </CardHeader>
              <CardContent>
                <RaceResult data={race} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  )
}
