import { DOMParser } from '@xmldom/xmldom'
import {
  Canvg,
  presets
} from 'canvg'
// } from 'https://cdn.skypack.dev/canvg@^4.0.2'

const preset = presets.offscreen({
  DOMParser
})

self.onmessage = async (event) => {
  const {
    width,
    height,
    offscreen,
    svg
  } = event.data
  const ctx = offscreen.getContext('2d')
  const v = await Canvg.from(ctx, svg, preset)
  v.start({ignoreAnimation:false})
}
