import { useAsync } from 'react-use'
import type { PersonaIdentifier } from '@masknet/shared-base'
import Services from '#services'
import type { AsyncState } from 'react-use/lib/useAsyncFn.js'

export function useExportPrivateKey(identifier: PersonaIdentifier): AsyncState<string> {
    return useAsync(async () => {
        return Services.Backup.backupPersonaPrivateKey(identifier)
    }, [identifier])
}