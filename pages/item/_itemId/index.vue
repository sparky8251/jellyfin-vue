<template>
  <v-container>
    <v-row>
      <v-col cols="9">
        <v-row>
          <v-col cols="3">
            <card :item="item" :text="false" />
          </v-col>
          <v-col cols="9">
            <h1 class="text-h4 font-weight-light">{{ item.Name }}</h1>
            <div class="text-caption text-h4 font-weight-medium">
              <media-info :item="item" year runtime rating ends-at />
            </div>
            <div class="mt-3 mb-2">
              <v-btn
                class="play-button mr-2"
                color="primary"
                min-width="8em"
                disabled
                depressed
                rounded
                :to="`./${item.Id}/play`"
                >{{ $t('play') }}</v-btn
              >
              <v-btn outlined icon>
                <v-icon>mdi-dots-horizontal</v-icon>
              </v-btn>
            </div>
            <v-col
              v-if="
                videoTracks.length > 0 &&
                audioTracks.length > 0 &&
                subtitleTracks.length > 0
              "
              class="mt-2"
              cols="10"
            >
              <v-row v-if="item.Genres.length > 1">
                <v-col cols="2" class="d-flex align-center">
                  <label class="text--secondary">Genres</label>
                </v-col>
                <v-col cols="7">{{ item.Genres.join(', ') }}</v-col>
              </v-row>
              <v-row v-if="videoTracks.length > 1">
                <v-col cols="2" class="d-flex align-center">
                  <label class="text--secondary">Video</label>
                </v-col>
                <v-col cols="7">
                  <v-select
                    v-model="select"
                    :items="videoTracks"
                    outlined
                    filled
                    flat
                    dense
                    single-line
                    hide-details
                  >
                    <template slot="selection" slot-scope="{ item }">
                      {{ item.DisplayTitle }}
                    </template>
                  </v-select>
                </v-col>
              </v-row>
              <v-row v-if="audioTracks.length > 1">
                <v-col cols="2" class="d-flex align-center">
                  <label class="text--secondary">Audio</label>
                </v-col>
                <v-col cols="7">
                  <v-select
                    v-if="audioTracks.length > 1"
                    v-model="select"
                    :items="audioTracks"
                    outlined
                    filled
                    flat
                    dense
                    single-line
                    hide-details
                  >
                    <template slot="selection" slot-scope="{ item }">
                      {{ item.DisplayTitle }}
                    </template>
                    <template slot="item" slot-scope="{ item, on, attrs }">
                      <v-list-item v-bind="attrs" two-line v-on="on">
                        <v-list-item-avatar>
                          <v-icon
                            v-text="getSurroundIcon(item.ChannelLayout)"
                          ></v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.Title
                          }}</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ getLanguageName(item.Language) }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
              <v-row v-if="subtitleTracks.length > 0">
                <v-col cols="2" class="d-flex align-center">
                  <label class="text--secondary">Subtitles</label>
                </v-col>
                <v-col cols="7">
                  <v-select
                    v-if="subtitleTracks.length > 0"
                    v-model="select"
                    :items="subtitleTracks"
                    outlined
                    filled
                    flat
                    dense
                    single-line
                    hide-details
                  >
                    <template slot="selection" slot-scope="{ item }">
                      {{ item.DisplayTitle }}
                    </template>
                    <template slot="item" slot-scope="{ item, on, attrs }">
                      <v-list-item v-bind="attrs" two-line v-on="on">
                        <v-list-item-content>
                          <v-list-item-title>{{
                            item.Title
                          }}</v-list-item-title>
                          <v-list-item-subtitle>
                            {{ getLanguageName(item.Language) }}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
            </v-col>
            <div>
              <p class="item-overview">{{ item.Overview }}</p>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <related-items
              v-if="item.Type !== 'Series'"
              :id="$route.params.itemId"
            />
            <season-tabs
              v-if="item.Type === 'Series'"
              :item="item"
            ></season-tabs>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <div v-if="directors.length > 0 && writers.length > 0">
          <h2>Crew</h2>
          <v-list color="transparent" two-line>
            <v-list-item
              v-for="director in directors"
              :key="director.Id"
              nuxt
              :to="`/person/${director.Id}`"
            >
              <v-list-item-avatar>
                <v-img
                  :src="`${$axios.defaults.baseURL}/Items/${director.Id}/Images/Primary`"
                />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ director.Name }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  director.Role || director.Type
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="writer in writers"
              :key="writer.Id"
              nuxt
              :to="`/person/${writer.Id}`"
            >
              <v-list-item-avatar>
                <v-img
                  :src="`${$axios.defaults.baseURL}/Items/${writer.Id}/Images/Primary`"
                />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ writer.Name }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  writer.Role || writer.Type
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
        <div v-if="actors.length > 0">
          <h2>Cast</h2>
          <v-list color="transparent" two-line>
            <v-list-item
              v-for="actor in actors"
              :key="actor.Id"
              nuxt
              :to="`/person/${actor.Id}`"
            >
              <v-list-item-avatar>
                <v-img
                  :src="`${$axios.defaults.baseURL}/Items/${actor.Id}/Images/Primary`"
                />
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title>{{ actor.Name }}</v-list-item-title>
                <v-list-item-subtitle>{{ actor.Role }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
        <related-items
          v-if="item.Type === 'Series'"
          :id="$route.params.itemId"
          vertical
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import langs from 'langs';
import { BaseItemDto, BaseItemPerson, MediaStream } from '~/api';
import imageHelper from '~/mixins/imageHelper';

export default Vue.extend({
  mixins: [imageHelper],
  data() {
    return {
      item: {} as BaseItemDto,
      backdropImageSource: ''
    };
  },
  computed: {
    directors: {
      get() {
        if (this.item.People) {
          // TODO: Figure out how common it is to have more than one director
          return this.item.People.filter((person: BaseItemPerson) => {
            return person.Type === 'Director';
          }).slice(0, 1);
        } else {
          return [];
        }
      }
    },
    writers: {
      get() {
        if (this.item.People) {
          return this.item.People.filter((person: BaseItemPerson) => {
            return person.Type === 'Writer';
          }).slice(0, 3);
        } else {
          return [];
        }
      }
    },
    actors: {
      get() {
        if (this.item.People) {
          return this.item.People.filter((person: BaseItemPerson) => {
            return person.Type === 'Actor';
          }).slice(0, 10);
        } else {
          return [];
        }
      }
    },
    videoTracks: {
      get() {
        if (this.item.MediaStreams) {
          return this.item.MediaStreams.filter(function (stream: MediaStream) {
            return stream.Type === 'Video';
          });
        } else {
          return [];
        }
      }
    },
    audioTracks: {
      get() {
        if (this.item.MediaStreams) {
          return this.item.MediaStreams.filter(function (stream: MediaStream) {
            return stream.Type === 'Audio';
          });
        } else {
          return [];
        }
      }
    },
    subtitleTracks: {
      get() {
        if (this.item.MediaStreams) {
          return this.item.MediaStreams.filter(function (stream: MediaStream) {
            return stream.Type === 'Subtitle';
          });
        } else {
          return [];
        }
      }
    }
  },
  async beforeMount() {
    const items = (
      await this.$api.items.getItems({
        uId: this.$auth.user.Id,
        userId: this.$auth.user.Id,
        ids: this.$route.params.itemId,
        fields: 'Overview,Genres,People,MediaStreams'
      })
    ).data.Items;

    if (items) {
      this.$store.dispatch('backdrop/set', { item: items[0] });
      this.item = items[0];
    }

    this.updateBackdropImage();
  },
  destroyed() {
    this.$store.dispatch('backdrop/clear');
  },
  methods: {
    getLanguageName(code: string) {
      return langs.where('2B', code).name;
    },
    getSurroundIcon(layout: string) {
      switch (layout) {
        case '2.0':
          return 'mdi-surround-sound-2-0';
        case '3.1':
          return 'mdi-surround-sound-3-1';
        case '5.1':
          return 'mdi-surround-sound-5-1';
        case '7.1':
          return 'mdi-surround-sound-7-1';
        default:
          return 'mdi-surround-sound';
      }
    },
    getItemBackdrop(id: string): string {
      if (window.innerWidth < window.innerHeight) {
        return `${this.$axios.defaults.baseURL}/Items/${id}/Images/Primary`;
      } else {
        return `${this.$axios.defaults.baseURL}/Items/${id}/Images/Backdrop`;
      }
    },
    updateBackdropImage() {
      this.backdropImageSource = this.getItemBackdrop(this.item.Id || '');
    }
  }
});
</script>
