import { ReturnTypeWithoutPromise } from '@/types/return-type-without-promise'
import { getCircuits } from './actions'

export type Circuit = ReturnTypeWithoutPromise<typeof getCircuits>[0]
