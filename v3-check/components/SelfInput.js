const SelfInput = {
  props: ['content', 'fontSize'],
  emits: ['enlarge-text'],
  template: `
    <div>
      <p style="width:50%;background:deepskyblue;padding:10px;border-radius:5px" :style="{fontSize: fs+'px',fontFamily:fm}">{{content}}</p>
      <button @click="$emit('enlarge-text', fs++)">enlarge-text</button>
      <button @click="$emit('ensmall-text', fs--)">enlarge-text</button>
      <select v-model="fm">
        <option disabled value="">-选择字体-</option>
        <option value="幼圆">幼圆</option>
        <option value="黑体">黑体</option>
        <option value="楷体">楷体</option>
      </select>
    </div>
  `,
  data() {
    return {
      fs: this.fontSize,
      fm: '',
    }
  },
}
