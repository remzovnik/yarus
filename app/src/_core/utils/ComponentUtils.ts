import { Component, App, createVNode, render, VNode, getCurrentInstance, ComponentInternalInstance, AppContext, h } from "vue";

type propsType = { props?: any; children?: unknown; element?: HTMLElement };

export const renderComponent = (component: Component, { props, children, element }: propsType) => {
  let el: HTMLElement | null = element || document.createElement("div");
  let vNode: VNode | null = createVNode(component, props, children);

  const instance = getCurrentInstance();
  if (instance?.appContext) {
    vNode.appContext = { ...instance?.appContext };
  }

  render(vNode, el);

  const destroy = () => {
    if (el) render(null, el);
    el = null;
    vNode = null;
  };

  return { vNode, destroy, el };
};

export const createComponent = (
  appContext: AppContext | null | undefined,
  component: Component,
  props?: any,
  element?: HTMLElement
) => {
  const vNode = h(component, props);
  const context = appContext || getCurrentInstance()?.appContext;

  if (!!context) {
    vNode.appContext = { ...context };
  }
  const el: HTMLElement | null = element || document.createElement("div");

  render(vNode, el);

  return vNode.component;
};
