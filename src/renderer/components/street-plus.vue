<template>
  <section
    class="street-plus__box"
    :class="$theme.streetPlusBox"
  >
    <div class="street-plus__group">
      <div
        class="street-plus__logo"
        :class="$theme.streetPlusLogo"
      >
        <img class="street-plus__img" :src="logoUrl"/>
      </div>
      <!-- <button class="street-plus__button" v-stream:click="toggleStock$">
        <Octicon name="package" scale="1.5" :class="$theme.streetPlusIcon"/>
      </button> -->
      <button ref="tagButton" class="street-plus__button">
        <Octicon name="tag" scale="1.5" :class="$theme.streetPlusIcon"/>
      </button>
      <button ref="searchButton" class="street-plus__button">
        <Octicon name="search" scale="1.2" :class="$theme.streetPlusIcon"/>
      </button>
    </div>

    <!-- stockとか使いたくなったら実装 -->
    <!-- <div class="street-plus__group--bottom">
      <div
        class="street-plus__logo"
        :class="$theme.streetPlusLogo"
      >
        <img class="street-plus__img" :src="user && user.get('profileImageUrl')"/>
      </div>
    </div> -->

    <section
      ref="tagForm"
    >
      <form
        class="street-plus__form"
        v-stream:submit="{
          subject: submit$,
          data: {
            instanceData: {
              type: 'TAG',
              context: {
                tagId: form.tag
              }
            },
            value: form.tag
          }
        }"
      >
        <div class="street-plus__form-group">
          <label
            ref="tagInput"
            class="street-plus__form-label"
            for="tagId"
          >タグID</label>
          <input
            class="street-plus__form-input"
            :class="$theme.input"
            id="tagId"
            v-model.trim="form.tag"
          />
        </div>
        <div class="street-plus__form-group">
          <button
            class="street-plus__form-button"
            :class="$theme.accentButton"
            type="submit">追加</button>
        </div>
      </form>
    </section>
    <section
      ref="searchForm"
    >
      <form
        class="street-plus__form"
        v-stream:submit="{
          subject: submit$,
          data: {
            instanceData: {
              type: 'SEARCH',
              context: {
                searchText: form.search
              }
            },
            value: form.search
          }
        }"
      >
        <div class="street-plus__form-group">
          <label
            ref="searchInput"
            class="street-plus__form-label"
            for="tagId"
          >検索</label>
          <input
            class="street-plus__form-input"
            :class="$theme.input"
            id="tagId"
            v-model.trim="form.search"
          />
        </div>
        <div class="street-plus__form-group">
          <button
            class="street-plus__form-button"
            :class="$theme.accentButton"
            type="submit">追加</button>
        </div>
      </form>
    </section>
  </section>
</template>

<script>
import Rx from 'rxjs/Rx';
import tippy from 'tippy.js';
import Octicon from 'vue-octicon/components/Octicon';
import 'vue-octicon/icons/plus';
import 'vue-octicon/icons/package';
import 'vue-octicon/icons/tag';
import 'vue-octicon/icons/search';
import Street from '../records/street';
import Card from './card';
import {moveTo} from '@/helpers';

export default {
  components: {
    Card,
    Octicon
  },
  props: {
    user: {
      // required: true
    }
  },
  data() {
    return {
      logoUrl: 'static/logo.svg',
      tagId: '',
      tagTip: null,
      searchTip: null,
      form: {
        tag: '',
        search: ''
      }
    };
  },
  computed: {
    formData() {
      return {
        tagId: this.tagId,
        hoge: 'asdf'
      };
    }
  },
  domStreams: ['toggleStock$', 'submit$'],
  subscriptions() {
    this.addStreet$ = new Rx.BehaviorSubject({data: {type: 'button'}});

    this.toggleStock$
      .do(({event}) => event.preventDefault())
      .subscribe(() => {
        const data = {
          type: 'STOCK',
          context: {
            userId: this.user.get('id')
          }
        };
        const street = new Street(data);
        this.state$.next({
          fn: state => state.addStreet(street)
        })
      });

    this.submit$
      .do(({event}) => event.preventDefault())
      .pluck('data')

      // .flatMap(() => {
      //   return Rx.Observable
      //     .from(Object.values(this.formData))
      //     .every(val => val !== '');
      // })
      .switchMap(data => {
        if (data.value !== '') {
          return Rx.Observable.of(data.instanceData);
        }
        return Rx.Observable.never();
      })
      .map(instanceData => {
        const street = new Street(instanceData);
        // TODO:
        this.form.tag = '';
        this.form.search = '';

        return {
          fn: state => {
            return state.addStreet(street);
          }
        }

        // });
        // setTimeout(() => {
        //   this.addStreet$.next({data: {type: 'button'}});
        // }, 0);
      })
      .subscribe(this.state$);

    return {
      type: this.addStreet$
        .pluck('data')
        .pluck('type')
    };
  },
  mounted() {
    this.tagTip = tippy(this.$refs.tagButton, {
      html: this.$refs.tagForm,
      position: 'right-start',
      animation: 'shift',
      theme: 'light',
      interactive: true,
      size: 'small',
      shown: () => {
        this.$refs.tagInput.focus();
      },
      hidden: () => {
        this.form.tag = '';
      },
    });

    this.searchTip = tippy(this.$refs.searchButton, {
      html: this.$refs.searchForm,
      position: 'right-start',
      animation: 'shift',
      theme: 'light',
      interactive: true,
      size: 'small',
      shown: () => {
        this.$refs.searchInput.focus();
      },
      hidden: () => {
        this.form.search = '';
      },
    });
  }
}
</script>

<style scoped>
  .street-plus__box {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    min-width: 66px;
    max-width: 66px;
    position: fixed;
    z-index: 9;
    top: 0;
    left: 0;
  }
  .street-plus__group {

  }
  .street-plus__img {
    max-width: 100%;
  }
  .street-plus__logo {
    width: calc(100% + 0px);
    padding: 16px;
    box-sizing: border-box;
    margin: 0 auto .5em;
  }
  .street-plus__logo + .street-plus__logo {
    margin-top: -1.5em;
  }
  .street-plus__box:hover .icon svg {
    opacity: .5;
  }
  .street-plus__button {
    margin: .5em;
    border: none;
    background: #fff;
    padding: .5em;
    width: 4em;
    height: 4em;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    cursor: pointer;
    border: 1px solid rgba(0,0,0,.7);
    transform: scale(0.7);
  }
  .street-plus__button:not(:first-child) {
    margin-top: 0;
  }
  .street-plus__button svg {
    display: block;
    fill: #222;
    transition: .2s;
  }
  .street-plus__form,
  .street-plus__form-group {
    display: flex;
    flex-direction: column;
  }
  .street-plus__form {
    width: 13em;
    height: 8em;
    margin: .5em 0;
  }
  .street-plus__form-group {
    margin: .5em 0;
  }
  /*.street-plus__form-input,
  .street-plus__form-label {
    margin: 1em 0;
  }*/
  .street-plus__form-label {
    text-align: left;
    margin: 0 0 .34em .55em;
    font-weight: bold;
  }
  .street-plus__form-input {
    padding: .34em .55em;
  }
  .street-plus__form-button {
    padding: .34em .55em;
  }
</style>
