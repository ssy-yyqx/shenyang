<template>
  <Container>
    <MapOl />
  </Container>
</template>

<script>
import Container from '@/components/Container'
import MapOl from '@/components/MapOl'
export default {
  name: 'Dashboard',
  components: { Container, MapOl },
  data() {
    return {
      map: null
    }
  },
  computed: {
  },
  watch: {

  },
  mounted() {

  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

</style>
