import { ReturnTypeWithoutPromise } from '@/types/return-type-without-promise'
import { getPilots } from './actions'

export type Pilot = ReturnTypeWithoutPromise<typeof getPilots>[0]
