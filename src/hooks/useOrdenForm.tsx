import { guardarOrden } from '@/lib/sheetsService'
import type { DatosIniciales, LoteOrden, ProductoLinea } from '@/lib/schemas'
import { useAppStore } from '@/store/app'
import { useMutation } from '@tanstack/react-query'
import { router } from 'expo-router'
import { useState } from 'react'
import { Alert } from 'react-native'

export function useOrdenForm(data: DatosIniciales | undefined) {
  const { campania, establecimiento } = useAppStore()

  // encabezado
  const [fecha, setFecha] = useState(new Date())
  const [labor, setLabor] = useState('')
  const [responsable, setResponsable] = useState('')
  const [proveedor, setProveedor] = useState('')
  const [observaciones, setObservaciones] = useState('')

  // lote en construcción
  const [lote, setLote] = useState('')
  const [cultivo, setCultivo] = useState('')
  const [producto, setProducto] = useState('')
  const [dosis, setDosis] = useState('')
  const [unidad, setUnidad] = useState('')
  const [productosLote, setProductosLote] = useState<ProductoLinea[]>([])

  // lotes confirmados
  const [lotes, setLotes] = useState<LoteOrden[]>([])

  // derived
  const lotesDeEstab =
    data?.datosLotes.filter(([e]) => e === establecimiento).map(([, l]) => l) ?? []

  const productosSegunLabor = (): string[] => {
    if (!labor || !data) return []
    const n = labor
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    if (n === 'siembra') return data.variedades
    if (n === 'fertilizacion' || n === 'refertilizacion') return data.fertilizantes
    if (n.includes('labranza')) return data.labranzas
    return data.insumosAgro
  }

  // actions
  const addProducto = () => {
    if (!producto) return Alert.alert('Falta producto')
    setProductosLote((p) => [...p, { producto, dosis, unidad }])
    setProducto('')
    setDosis('')
    setUnidad('')
  }

  const confirmarLote = () => {
    if (!lote) return Alert.alert('Falta lote')
    if (!productosLote.length) return Alert.alert('Agregá al menos un producto')
    const sup = data?.datosLotes.find(([e, l]) => e === establecimiento && l === lote)?.[2] ?? 0
    setLotes((ls) => [
      ...ls,
      {
        establecimiento: establecimiento!,
        lote,
        cultivo,
        superficie: sup,
        productos: productosLote,
      },
    ])
    setLote('')
    setCultivo('')
    setProductosLote([])
  }

  const mutation = useMutation({
    mutationFn: guardarOrden,
    onSuccess: () => {
      Alert.alert('✅ Guardado')
      router.back()
    },
    onError: (e: Error) => Alert.alert('Error', e.message),
  })

  const guardar = () => {
    if (!campania || !labor || !responsable) return Alert.alert('Completá los campos obligatorios')
    if (!lotes.length) return Alert.alert('Agregá al menos un lote')
    mutation.mutate({
      campania,
      fecha: fecha.toISOString().split('T')[0],
      labor,
      responsable,
      proveedor,
      observaciones,
      lotes,
    })
  }

  return {
    // encabezado state
    fecha,
    setFecha,
    labor,
    setLabor,
    responsable,
    setResponsable,
    proveedor,
    setProveedor,
    observaciones,
    setObservaciones,
    // lote state
    lote,
    setLote,
    cultivo,
    setCultivo,
    producto,
    setProducto,
    dosis,
    setDosis,
    unidad,
    setUnidad,
    productosLote,
    lotes,
    // derived
    lotesDeEstab,
    productosSegunLabor,
    // actions
    addProducto,
    confirmarLote,
    guardar,
    isPending: mutation.isPending,
  }
}
