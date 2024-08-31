<script setup lang="ts">
import type { Project } from '~~/server/api/projects/index.get'

const { t } = useI18n()

useHead({
    title: t('app.work'),
})

const { data } = await useFetch<Project[]>('/api/projects')

const localePath = useLocalePath()

</script>

<script>
export default {
  methods: {
     formatDate(params) {
  let defalutParams = {
    date: new Date(new Date().getTime()),
    formatStr: 'yyyy-MM-dd HH:mm:ss'
  };
  params = { ...defalutParams, ...params };

  let date = new Date(new Date(params.date).getTime());
  let formatStr = params.formatStr;

  formatStr = formatStr.replace(new RegExp('yyyy'), `${date.getFullYear()}`);
  const month = date.getMonth() + 1;
  formatStr = formatStr.replace(new RegExp('MM'), `${month > 9 ? month : '0' + month}`);
  const day = date.getDate();
  formatStr = formatStr.replace(new RegExp('dd'), `${day > 9 ? day : '0' + day}`);
  const hour = date.getHours()+8;
  formatStr = formatStr.replace(new RegExp('HH'), `${hour > 9 ? hour : '0' + hour}`);
  const min = date.getMinutes();
  formatStr = formatStr.replace(new RegExp('mm'), `${min > 9 ? min : '0' + min}`);
  const sec = date.getSeconds();
  formatStr = formatStr.replace(new RegExp('ss'), `${sec > 9 ? sec : '0' + sec}`);

  return formatStr;
}
  }
}
</script>

<template>
    <app-layout :title="$t('work.projects') " class="container mx-auto">
        <div class="divide-y divide-dashed">
            <div v-for="item in data" :key="item.id" class="flex flex-col md:flex-row space-x-4 p-4">
                <div class="mb-6 md:mb-0 w-4/5 md:w-[200px] xl:w-[240px] self-center md:self-auto">
                    <ui-aspect-ratio :ratio="16 / 10">
                        <my-sanity-image
                            :src="item.coverImage.asset._id"
                            fit="cover" height="330px"
                            :placeholder="item.coverImage.asset.metadata.lqip!"
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
                       {{$formatDate({ date: item.publishDate, formatStr: 'yyyy-MM-dd HH:mm:ss' })}}
                      
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
    </app-layout>
</template>
