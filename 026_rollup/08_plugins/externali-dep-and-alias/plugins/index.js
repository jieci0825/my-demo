export function externaliDepAndAlias() {
    return {
        name: 'externali-dep-and-alias',
        resolveId(id) {
            if (id.startsWith('@')) {
                return {
                    id: id.replace('@', '$'),
                    external: true
                }
            }
            return null
        }
    }
}
