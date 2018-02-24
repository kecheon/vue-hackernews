<template>
  <div class="item-list-view">
    <div class="item-list">
      <item
        v-for="item in displayedItems"
        :key="item.id"
        :item="item"
      />
    </div>
  </div>
</template>

<script>
import Item from '../components/Item.vue'
import { mapActions } from 'vuex'

export default {
  name: 'item-list',
  components: {
    Item
  },

  beforeMount () {
    this.loadItems()
  },

  data () {
    return {
      displayedItems: []
    }
  },

  methods: {
    ...mapActions(['fetchListData']),
    loadItems () {
      this.$bar.start()
      this.fetchListData({
        type: 'top'
      }).then(() => {
        this.displayedItems = this.$store.state.items
        this.$bar.finish()
      })
    }
  }
}
</script>

<style>
.item-list-view {
	padding-top: 45px;
}
.item-list {
	background-color: #fff;
	border-radius: 2px;
	position: absolute;
	margin: 30px 0;
	width: 100%;
	transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
@media (max-width: 600px) {
	.item-list {
		margin: 10px 0;
	}
}
</style>
