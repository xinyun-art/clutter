const useDayWorks = () => {
	/*---------ref data----------*/
	const works = ref(['wake up', 'brush my teeth', 'wash the face', 'go to work'])
	const state = ref({ one: 'happy', two: 'upset' })
	const wish = ref('job-hopping')

	/*---------computed----------*/
	const worksplus = computed(() =>
		works.value.map(work =>
			work
				.split(' ')
				.map(item => item.charAt(0).toUpperCase() + item.slice(1))
				.join('-')
		)
	)
	const stateplus = computed(() => ({ one: state.value.one + '!', two: state.value.two + '!' }))
	const wishplus = computed(() => wish.value.charAt(0).toUpperCase() + wish.value.slice(1))

	/*---------watch----------*/
	// 监听 ref 数组类型 的响应式数据--暂测试只能监听到数组中某个具体的项，无法监听整个数组
	const worksWatch = watch(
		() => works.value[0],
		(newVal, preVal) => {
			console.log('worksWatch-newVal:', newVal)
			console.log('worksWatch-preVal:', preVal)
		}
	)
	// 监听 ref 对象类型 的响应式数据--暂测试只能监听到对象中某个具体的属性，无法监听整个对象
	const stateWatch = watch(
		() => state.value.one,
		(newVal, preVal) => {
			console.log('stateWatch-newVal:', newVal)
			console.log('stateWatch-preVal:', preVal)
		}
	)
	// 监听 ref 字符串类型 的响应式数据
	const wishWatch = watch(wish, (newVal, preVal) => {
		console.log('wishWatch-newVal:', newVal)
		console.log('wishWatch-preVal:', preVal)
	})

	/*---------return data----------*/
	return { works, worksplus, worksWatch, state, stateplus, stateWatch, wish, wishplus, wishWatch }
}
