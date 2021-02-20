const useHobbies = () => {
	/*---------reactive data----------*/
	const hobbies = reactive(['read', 'watch movies', 'travel', 'play ball'])
	const wishMost = reactive({ work: 'fat salary', life: 'happiness' })

	/*---------computed----------*/
	const hobbiesplus = computed(() => hobbies.map(item => item.charAt(0).toUpperCase() + item.slice(1)))
	const wishMostplus = computed(() => ({ work: wishMost.work + '!', lift: wishMost.life + '!' }))

	/*---------watch----------*/
	// 监听 reactive 数组类型 的响应式数据--暂测试只能监听到数组中某个具体的项，无法监听整个数组
	const hobbiesWatch = watch(
		() => hobbies[0],
		(newVal, preVal) => {
			console.log('hobbiesWatch-newVal:', newVal)
			console.log('hobbiesWatch-preVal:', preVal)
			// if (preVal <= newVal) {}
			// if (preVal >= newVal) {}
			// if (preVal == newVal) {}
			// if (preVal === newVal) {}
			// if (preVal != newVal) {}
			// if (preVal !== newVal) {}
		}
	)
	// 监听 reactive 对象类型 的响应式数据--暂测试只能监听到对象中某个具体的属性，无法监听整个对象
	const wishMostWatch = watch(
		() => wishMost.work,
		(newVal, preVal) => {
			console.log('wishMostWatch-newVal:', newVal)
			console.log('wishMostWatch-preVal:', preVal)
		}
	)
	return { hobbies, hobbiesplus, hobbiesWatch, wishMost, wishMostplus }
}
