import { ActivityIndicator, View } from 'react-native'

const ContentLoader = () => {
  return (
    <View style={{ flex: 1 }}>
      <ActivityIndicator style={{ margin: 'auto' }} />
    </View>
  )
}

export default ContentLoader
