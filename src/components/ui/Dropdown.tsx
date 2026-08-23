import { Platform } from 'react-native'

import AndroidDropdown from './AndroidDropdown'
import IOSDropdown from './IOSDropdown'

interface Dropdown {
  selectedValue?: string
  onChangeValue: (val: string) => void
  values: string[]
  label?: string
}

const Dropdown = (props: Dropdown) => {
  const isAndroid = Platform.OS === 'android'
  return isAndroid ? <AndroidDropdown {...props} /> : <IOSDropdown {...props} />
}

export default Dropdown
