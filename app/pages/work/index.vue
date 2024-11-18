<script setup lang="ts">
import type { Project } from '~~/server/api/projects/index.get'
import type { ResolvedSanityImage } from '@sanity/asset-utils'
import type { Value } from 'sanity-plugin-internationalized-array'


export default {
  data() {
    return {
      items: [],
      lastPublishDate: '2222-11-14 10:42:55'
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    addItem() {
      this.fetchData();
    },
    async fetchData() {
            if (this.lastPublishDate === null) {
                this.items.push([])
            }
            var test = await useSanity().fetch<Project[]>(projectsQuery1, {this.lastPublishDate})
            console.log("result is :"+JSON.stringify(test))
            console.log("result length is :"+test.length)
            if (test.length > 0) {
                this.lastPublishDate = test[test.length - 1].publishDate
            } else {
                this.lastPublishDate = null // Reached the end
            }
            console.log('last publish date is: '+this.lastPublishDate)
            this.items.push(test)
    }
  }
};



const { t } = useI18n()

useHead({
    title: t('app.work'),
})


let lastPublishDate = '2222-11-14 10:42:55'

const projectsQuery1 = groq`
*[_type == "project" && publishDate < $lastPublishDate] | order(publishDate desc) [0...10] {
   "id": _id,
    name,
    description,
    "slug": slug.current,
    tags,
    url,
    publishDate,
    sourceCodeUrl,
    coverImage{
      asset->
    }
    }`


async function fetchNextPage() {
  if (lastPublishDate === null) {
    return []
  }
  let test = await useSanity().fetch<Project[]>(projectsQuery1, {lastPublishDate})
  console.log("result is :"+JSON.stringify(test))
  console.log("result length is :"+test.length)
  if (test.length > 0) {
    lastPublishDate = test[test.length - 1].publishDate
  } else {
    lastPublishDate = null // Reached the end
  }
  console.log('last publish date is: '+lastPublishDate)
  return test
}

 //window.addEventListener('scroll', handleScrollWindows);

 async function handleScrollWindows() {
      // 检查是否滚动到页面底部
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        // 触发加载更多数据
      var temp = await fetchNextPage();
      data.push(temp);
      console.log("fetch data length is "+data.length)
      }
}

let data = []
 //let data = await fetchNextPage()
//const {data} = await useFetch<Project[]>('/api/projects') 原始获取数据
console.log("begin log")
console.log("data is :"+JSON.stringify(data))
console.log("data length is "+data.length)

//已经弄清楚了，data是一个对象，里面的_rawValue属性才是一个数组
//所以下面的这个循环不会打印
for (let i = 0; i < data.length; i++) {
    //console.log("fix cover image "+data[i].id)
}
const localePath = useLocalePath();
</script>

<template>
    <app-layout :title="$t('work.projects') " class="container mx-auto">
        <div  class="divide-y divide-dashed">
            <div v-for="item in items" :key="item.id" class="flex flex-col md:flex-row space-x-4 p-4">
                <div class="mb-6 md:mb-0 w-4/5 md:w-[200px] xl:w-[240px] self-center md:self-auto">
                     <ui-aspect-ratio :ratio="16 / 10">
                        <my-sanity-image v-if="item.coverImage" 
                            :src="item.coverImage?.asset?._id!"
                            fit="cover" height="330px"
                            :placeholder="item.coverImage?.asset?.metadata?.lqip!"
                            class="bg-cover h-full w-full rounded object-cover"
                        />
                    </ui-aspect-ratio>
                </div>

                <div class="flex-1 flex flex-col">
                    <h2 class="text-[1.1rem] xl:text-xl font-medium mb-2">
                        {{ $sanityI18n(item.name) }}
                    </h2>

                    <p class="text-[0.9rem] xl:text-base text-muted-foreground leading-snug">
                        {{ $sanityI18n(item.description) }}
                    </p>
                    <p class="text-[0.9rem] xl:text-base text-muted-foreground leading-snug test">
                       {{new Date(new Date(item.publishDate).getTime() + (8 * 60 * 60 * 1000)).toISOString()}}
                      
                    </p>

                    <div class="mt-4 flex flex-wrap">
                        <work-tag v-for="tag in item.tags" :key="tag" :tag />
                    </div>

                    <div class="flex-1"></div>
                    <div class="flex space-x-2 pt-4 justify-center sm:justify-end">
                        <ui-button v-if="item.url" variant="secondary">
                            <a :href="item.url" target="_blank">{{ $t('work.visit') }}<icon name="iconamoon:link-external-light" class="ml-1" /></a>
                        </ui-button>
                        <ui-button v-if="item.sourceCodeUrl" variant="secondary">
                            <a :href="item.sourceCodeUrl" target="_blank">{{ $t('work.source-code') }}<icon name="iconamoon:link-external-light" class="ml-1" /></a>
                        </ui-button>
                        <ui-button variant="default">
                            <nuxt-link :to="localePath(`/work/${item.slug}`)">{{ $t('work.learn-more') }}</nuxt-link>
                        </ui-button>
                    </div>
                </div>
            </div>
        </div>
        <div><button @click="addItem">Next page</button></div>
    </app-layout>
</template>
