<script setup lang="ts">
import { computed, useSlots } from "vue";
import RouteModel from "@/modules/Main/models/RouteModel";
import { BaseButtonType } from "@/modules/Main/models/BaseButtonType";
import { StyleClasses } from "@/infrastructure/Style/StyleClasses.type";

const slots = useSlots();

type ButtonSubtype = "default" | "text";
type ButtonSize = "large" | "medium" | "small";

const props = withDefaults(
  defineProps<{
    route?: RouteModel;
    type?: BaseButtonType;
    subtype?: ButtonSubtype;
    size?: ButtonSize;
    icon?: string;
    iconSize?: number;
    isOutlined?: boolean;
    isAccent?: boolean;
    isLoading?: boolean;
    isDisabled?: boolean;
    isReversed?: boolean;
    isRounded?: boolean;
    isFullWidth?: boolean;
    isOnlyIcon?: boolean;
  }>(),
  {
    type: "primary",
    subtype: "default",
    size: "medium",
  }
);

const iconSize = computed<number>(() => {
  if (props.iconSize) {
    return props.iconSize;
  }

  if (props.subtype === "text" && props.size === "medium") {
    return 16;
  }

  return 20;
});

const classes = computed<StyleClasses>(() => {
  return {
    [`base-button_type_${props.type}`]: !!props.type,
    [`base-button_subtype_${props.subtype}`]: !!props.subtype,
    [`base-button_size_${props.size}`]: !!props.size,
    "base-button_icon-only": !slots.default || !!props.isOnlyIcon,
    "base-button_loading": !!props.isLoading,
    "base-button_disabled": !!props.isDisabled,
    "base-button_outlined": !!props.isOutlined,
    "base-button_accent": !!props.isAccent,
    "base-button_reversed": !!props.isReversed,
    "base-button_with-icon": !!props.icon,
    "base-button_rounded": !!props.isRounded,
    "base-button_full-width": !!props.isFullWidth,
  };
});
</script>

<template>
  <component
    :is="route ? 'router-link' : 'button'"
    :to="route"
    :target="route?.blank || false"
    class="base-button"
    :class="classes"
    :disabled="isDisabled || isLoading"
    @keydown.space.prevent
  >
    <BaseIcon v-if="icon && !isLoading" class="base-button__icon" :name="icon" :size="iconSize" />
    <BaseIcon v-if="isLoading" class="base-button__icon base-button__icon_loader" :size="iconSize" name="loader" />
    <span v-if="!!$slots.default && !isOnlyIcon" class="base-button__text"><slot></slot></span>
  </component>
</template>

<style lang="scss">
.base-button {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  border-radius: $border-radius-sm;
  transition: background-color $trs-back, color $trs-back;

  &:not(.base-button_full-width) {
    .base-button__text {
      flex-grow: 1;
    }
  }

  &:not(.base-button_icon-only) {
    .base-button__icon {
      margin-right: 0.8rem;
    }
  }

  & > * {
    pointer-events: none;
  }

  &__text {
    white-space: nowrap;
  }

  &_type {
    &_primary {
      &.base-button {
        &_subtype {
          &_default {
            color: $white-100;
            background-color: $blue-100;

            &:hover {
              background-color: $blue-200;
              transition: background-color $trs-forward;
            }

            &:active {
              background-color: $blue-300;
              transition: background-color $trs-forward;
            }

            .base-button__icon_loader {
              svg {
                fill: $white-100;
              }
            }

            &.base-button {
              &_size {
                &_large {
                  @include label-16;

                  padding: 1.3rem 3.8rem;

                  &.base-button_icon-only {
                    padding: 1.4rem;
                  }
                }

                &_medium {
                  @include label-14;

                  padding: 1rem 3rem;

                  &.base-button_icon-only {
                    padding: 1rem;
                  }
                }

                &_small {
                  @include label-14;

                  padding: 1rem 2.6rem;

                  &.base-button_icon-only {
                    padding: 1rem;
                  }
                }
              }
            }
          }

          &_text {
            color: $gray-600;
            background-color: transparent;

            &:hover {
              color: $blue-200;
              transition: color $trs-forward;
            }

            &:active {
              color: $blue-300;
              transition: color $trs-forward;
            }

            &.base-button {
              &_size {
                &_large {
                  @include label-16;
                }

                &_medium {
                  @include label-14;
                }

                &_small {
                  @include label-14;
                }
              }
            }
          }
        }

        &_outlined {
          color: $blue-100;
          background-color: transparent;
          border: 1px solid $blue-100;

          &:hover {
            background-color: transparent;
          }

          &:active {
            background-color: transparent;
          }
        }
      }
    }

    &_secondary {
      &.base-button {
        &_subtype {
          &_default {
            color: $gray-600;
            background-color: $gray-200;

            &:hover {
              background-color: $gray-300;
            }

            &:active {
              background-color: $gray-400;
            }

            .base-button__icon_loader {
              svg {
                fill: $gray-600;
              }
            }

            &.base-button {
              &_size {
                &_large {
                  @include label-16;

                  padding: 1.3rem 3.8rem;

                  &.base-button_icon-only {
                    padding: 1.4rem;
                  }
                }

                &_medium {
                  @include label-14;

                  padding: 1rem 3rem;

                  &.base-button_icon-only {
                    padding: 1rem;
                  }
                }

                &_small {
                  @include label-14;

                  padding: 1rem 2.6rem;

                  &.base-button_icon-only {
                    padding: 1rem;
                  }
                }
              }
            }
          }

          &_text {
            color: $gray-500;
            background-color: transparent;

            &.base-button {
              &_size {
                &_large {
                  @include label-16;
                }

                &_medium {
                  @include label-14;
                }

                &_small {
                  @include label-14;
                }
              }
            }
          }
        }

        &_outlined {
          color: $gray-600;
          background-color: transparent;
          border: 1px solid $gray-200;

          &:hover {
            background-color: transparent;
          }

          &:active {
            background-color: transparent;
          }
        }
      }
    }

    &_list-item {
      &.base-button {
        width: 100%;
        text-align: left;
        background-color: transparent;

        &_subtype {
          &_default {
            color: $gray-600;
            background-color: transparent;

            &:hover {
              background-color: $gray-300;
            }

            &:active {
              background-color: $gray-400;
            }

            &.base-button {
              &_size {
                &_large {
                  @include label-16;

                  padding: 1.3rem 1rem;

                  &.base-button_icon-only {
                    padding: 1.4rem;
                  }
                }

                &_medium {
                  @include label-14;

                  padding: 1rem 1.6rem;

                  &.base-button_icon-only {
                    padding: 1rem;
                  }
                }

                &_small {
                  @include label-14;

                  padding: 1rem 1.6rem;

                  &.base-button_icon-only {
                    padding: 1rem;
                  }
                }
              }
            }
          }

          &_text {
            color: $gray-500;
            background-color: transparent;

            &.base-button {
              &_size {
                &_large {
                  @include label-16;
                }

                &_medium {
                  @include label-14;
                }

                &_small {
                  @include label-14;
                }
              }
            }
          }
        }
      }
    }

    &_transparent {
      background-color: transparent;

      &.base-button {
        background-color: transparent;
      }
    }

    &_circle {
      &.base-button {
        color: $white-100;
        background-color: $gray-800-60;
        border-radius: 100%;
        backdrop-filter: blur(1.6rem);

        &_size {
          &_large {
            width: 4.8rem;
            height: 4.8rem;
          }

          &_medium {
            width: 4rem;
            height: 4rem;
          }
        }

        &:hover {
          color: $white-100;
          background-color: $gray-800-70;
        }

        &:active {
          color: $white-100;
          background-color: $gray-600;
        }
      }
    }
  }

  &_loading {
    pointer-events: none;
  }

  &_loading,
  &_with-icon {
    &.base-button_type_primary {
      &.base-button {
        &_subtype {
          &_default {
            &.base-button {
              &_size {
                &_large {
                  padding: 1.3rem 2.4rem;

                  &.base-button_icon-only {
                    padding: 1.4rem;
                  }
                }

                &_medium {
                  padding: 1rem 1.6rem;

                  &.base-button_icon-only {
                    padding: 1rem;
                  }
                }

                &_small {
                  padding: 1rem 1.6rem;

                  &.base-button_icon-only {
                    padding: 1rem;
                  }
                }
              }
            }
          }
        }
      }
    }

    &.base-button_type_secondary {
      &.base-button {
        &_subtype {
          &_default {
            &.base-button {
              &_size {
                &_large {
                  padding: 1.3rem 2.4rem;

                  &.base-button_icon-only {
                    padding: 1.4rem;
                  }
                }

                &_medium {
                  padding: 1rem 1.6rem;

                  &.base-button_icon-only {
                    padding: 1rem;
                  }
                }

                &_small {
                  padding: 1rem 1.6rem;

                  &.base-button_icon-only {
                    padding: 1rem;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  &_reversed {
    flex-direction: row-reverse;

    .base-button {
      &__text {
        margin-right: 0.8rem;
        margin-left: 0;
      }
    }
  }

  &_rounded {
    border-radius: 100%;
  }

  &_accent {
    @include label-14;

    color: $blue-100 !important;

    &:hover {
      color: $blue-200 !important;
      transition: color 0.3s $trs-forward;
    }

    &:active {
      color: $blue-300 !important;
      transition: color 0.3s $trs-back;
    }
  }

  &_disabled {
    color: $gray-500 !important;
    pointer-events: none;

    &:not(.base-button_type_transparent),
    &:not(.base-button_subtype_text) {
      background-color: $gray-200 !important;
    }

    &.base-button_type_transparent,
    &.base-button_subtype_text {
      background-color: transparent !important;
    }

    &.base-button_outlined {
      color: $gray-400;
      background-color: transparent !important;
      border-color: $gray-400;
    }
  }

  &_full-width {
    width: 100%;
  }
}
</style>
