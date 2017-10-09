import DocumentNode from './renderer/DocumentNode'
import Moon from 'moonjs/dist/moon'
import { start } from 'application'
import { Page } from 'ui/page'

global.document = new DocumentNode()

Moon.prototype.$start = function () {
  this.__is_root__ = true

  const placeholder = document.createElement('placeholder')

  this.mount(placeholder)
}

const mountMoon = Moon.prototype.mount

const mount = function (el) {
  if (this.__is_root__) {
    const self = this

    start({
      create() {
        console.log('>>>>>> CREATE')
        console.log(el)
        mountMoon.call(self, el)

        console.dir(Object.keys(self))
        //const page = self.root.nativeView

        return new Page
      }
    })
  } else {
    mountMoon.call(this, el)
  }
}

Moon.prototype.mount = function (el) {
  return mount.call(this, el)
}

export default Moon;
