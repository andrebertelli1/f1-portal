import { ReturnTypeWithoutPromise } from '@/types/return-type-without-promise'
import { getScuderia } from './actions'

export type Scuderia = ReturnTypeWithoutPromise<typeof getScuderia>[0]
