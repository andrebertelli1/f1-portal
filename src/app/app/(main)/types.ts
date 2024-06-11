import { ReturnTypeWithoutPromise } from '@/types/return-type-without-promise'
import { getRaces } from './actions'

export type Races = ReturnTypeWithoutPromise<typeof getRaces>[0]
