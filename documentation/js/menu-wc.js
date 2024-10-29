'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">starbucks_js documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-4da950340f6d304642cd66dbf5f47a47c25b220e8ee161e8187a83fed6a7e5f746274ff65c2c6cf3e5626ab04e962e3f8c6e2f40117638abade5418eec5f9286"' : 'data-bs-target="#xs-controllers-links-module-AppModule-4da950340f6d304642cd66dbf5f47a47c25b220e8ee161e8187a83fed6a7e5f746274ff65c2c6cf3e5626ab04e962e3f8c6e2f40117638abade5418eec5f9286"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-4da950340f6d304642cd66dbf5f47a47c25b220e8ee161e8187a83fed6a7e5f746274ff65c2c6cf3e5626ab04e962e3f8c6e2f40117638abade5418eec5f9286"' :
                                            'id="xs-controllers-links-module-AppModule-4da950340f6d304642cd66dbf5f47a47c25b220e8ee161e8187a83fed6a7e5f746274ff65c2c6cf3e5626ab04e962e3f8c6e2f40117638abade5418eec5f9286"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-4da950340f6d304642cd66dbf5f47a47c25b220e8ee161e8187a83fed6a7e5f746274ff65c2c6cf3e5626ab04e962e3f8c6e2f40117638abade5418eec5f9286"' : 'data-bs-target="#xs-injectables-links-module-AppModule-4da950340f6d304642cd66dbf5f47a47c25b220e8ee161e8187a83fed6a7e5f746274ff65c2c6cf3e5626ab04e962e3f8c6e2f40117638abade5418eec5f9286"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-4da950340f6d304642cd66dbf5f47a47c25b220e8ee161e8187a83fed6a7e5f746274ff65c2c6cf3e5626ab04e962e3f8c6e2f40117638abade5418eec5f9286"' :
                                        'id="xs-injectables-links-module-AppModule-4da950340f6d304642cd66dbf5f47a47c25b220e8ee161e8187a83fed6a7e5f746274ff65c2c6cf3e5626ab04e962e3f8c6e2f40117638abade5418eec5f9286"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-ffc138016e743abd120d460f638812e47500b932439d83d20cc76bde17aaecfa9690dd857937d62b052eb6149990358cc16898ab9659efaf8ba1af0f476bcd06"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-ffc138016e743abd120d460f638812e47500b932439d83d20cc76bde17aaecfa9690dd857937d62b052eb6149990358cc16898ab9659efaf8ba1af0f476bcd06"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-ffc138016e743abd120d460f638812e47500b932439d83d20cc76bde17aaecfa9690dd857937d62b052eb6149990358cc16898ab9659efaf8ba1af0f476bcd06"' :
                                            'id="xs-controllers-links-module-AuthModule-ffc138016e743abd120d460f638812e47500b932439d83d20cc76bde17aaecfa9690dd857937d62b052eb6149990358cc16898ab9659efaf8ba1af0f476bcd06"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-ffc138016e743abd120d460f638812e47500b932439d83d20cc76bde17aaecfa9690dd857937d62b052eb6149990358cc16898ab9659efaf8ba1af0f476bcd06"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-ffc138016e743abd120d460f638812e47500b932439d83d20cc76bde17aaecfa9690dd857937d62b052eb6149990358cc16898ab9659efaf8ba1af0f476bcd06"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-ffc138016e743abd120d460f638812e47500b932439d83d20cc76bde17aaecfa9690dd857937d62b052eb6149990358cc16898ab9659efaf8ba1af0f476bcd06"' :
                                        'id="xs-injectables-links-module-AuthModule-ffc138016e743abd120d460f638812e47500b932439d83d20cc76bde17aaecfa9690dd857937d62b052eb6149990358cc16898ab9659efaf8ba1af0f476bcd06"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GoogleAuthStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >GoogleAuthStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/KakaoAuthStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >KakaoAuthStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalAuthStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalAuthStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/NaverAuthStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >NaverAuthStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TokenStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >TokenStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DbModule.html" data-type="entity-link" >DbModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/EmailModule.html" data-type="entity-link" >EmailModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-EmailModule-154712f7ecc180b16978e1bfbcd44a4dff45e6b84c32d58f85f98c8042af9ce15371ef68277faabd1348281df886101356081a38c728b760007965d0c0c5aca1"' : 'data-bs-target="#xs-injectables-links-module-EmailModule-154712f7ecc180b16978e1bfbcd44a4dff45e6b84c32d58f85f98c8042af9ce15371ef68277faabd1348281df886101356081a38c728b760007965d0c0c5aca1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EmailModule-154712f7ecc180b16978e1bfbcd44a4dff45e6b84c32d58f85f98c8042af9ce15371ef68277faabd1348281df886101356081a38c728b760007965d0c0c5aca1"' :
                                        'id="xs-injectables-links-module-EmailModule-154712f7ecc180b16978e1bfbcd44a4dff45e6b84c32d58f85f98c8042af9ce15371ef68277faabd1348281df886101356081a38c728b760007965d0c0c5aca1"' }>
                                        <li class="link">
                                            <a href="injectables/EmailService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProductModule.html" data-type="entity-link" >ProductModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProductModule-10d7bb2a5b5bb9a639db1332f354d68d29720e0f0ff4e7c5469fe17bd23559e4fb2ef65cef35b7dd976ac09fe746a3755fd54d8ddf755226572db50e62956f06"' : 'data-bs-target="#xs-controllers-links-module-ProductModule-10d7bb2a5b5bb9a639db1332f354d68d29720e0f0ff4e7c5469fe17bd23559e4fb2ef65cef35b7dd976ac09fe746a3755fd54d8ddf755226572db50e62956f06"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProductModule-10d7bb2a5b5bb9a639db1332f354d68d29720e0f0ff4e7c5469fe17bd23559e4fb2ef65cef35b7dd976ac09fe746a3755fd54d8ddf755226572db50e62956f06"' :
                                            'id="xs-controllers-links-module-ProductModule-10d7bb2a5b5bb9a639db1332f354d68d29720e0f0ff4e7c5469fe17bd23559e4fb2ef65cef35b7dd976ac09fe746a3755fd54d8ddf755226572db50e62956f06"' }>
                                            <li class="link">
                                                <a href="controllers/ProductController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProductModule-10d7bb2a5b5bb9a639db1332f354d68d29720e0f0ff4e7c5469fe17bd23559e4fb2ef65cef35b7dd976ac09fe746a3755fd54d8ddf755226572db50e62956f06"' : 'data-bs-target="#xs-injectables-links-module-ProductModule-10d7bb2a5b5bb9a639db1332f354d68d29720e0f0ff4e7c5469fe17bd23559e4fb2ef65cef35b7dd976ac09fe746a3755fd54d8ddf755226572db50e62956f06"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProductModule-10d7bb2a5b5bb9a639db1332f354d68d29720e0f0ff4e7c5469fe17bd23559e4fb2ef65cef35b7dd976ac09fe746a3755fd54d8ddf755226572db50e62956f06"' :
                                        'id="xs-injectables-links-module-ProductModule-10d7bb2a5b5bb9a639db1332f354d68d29720e0f0ff4e7c5469fe17bd23559e4fb2ef65cef35b7dd976ac09fe746a3755fd54d8ddf755226572db50e62956f06"' }>
                                        <li class="link">
                                            <a href="injectables/ProductService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RedisModule.html" data-type="entity-link" >RedisModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-UserModule-0d0006676078d9ac987c4081096cceff5bcadccda319d42c7619595e80c5714c6706287ceb4862b31bb28c781284c1051441ca8fd33cc02ae334187eea97d2da"' : 'data-bs-target="#xs-controllers-links-module-UserModule-0d0006676078d9ac987c4081096cceff5bcadccda319d42c7619595e80c5714c6706287ceb4862b31bb28c781284c1051441ca8fd33cc02ae334187eea97d2da"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-0d0006676078d9ac987c4081096cceff5bcadccda319d42c7619595e80c5714c6706287ceb4862b31bb28c781284c1051441ca8fd33cc02ae334187eea97d2da"' :
                                            'id="xs-controllers-links-module-UserModule-0d0006676078d9ac987c4081096cceff5bcadccda319d42c7619595e80c5714c6706287ceb4862b31bb28c781284c1051441ca8fd33cc02ae334187eea97d2da"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-UserModule-0d0006676078d9ac987c4081096cceff5bcadccda319d42c7619595e80c5714c6706287ceb4862b31bb28c781284c1051441ca8fd33cc02ae334187eea97d2da"' : 'data-bs-target="#xs-injectables-links-module-UserModule-0d0006676078d9ac987c4081096cceff5bcadccda319d42c7619595e80c5714c6706287ceb4862b31bb28c781284c1051441ca8fd33cc02ae334187eea97d2da"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-0d0006676078d9ac987c4081096cceff5bcadccda319d42c7619595e80c5714c6706287ceb4862b31bb28c781284c1051441ca8fd33cc02ae334187eea97d2da"' :
                                        'id="xs-injectables-links-module-UserModule-0d0006676078d9ac987c4081096cceff5bcadccda319d42c7619595e80c5714c6706287ceb4862b31bb28c781284c1051441ca8fd33cc02ae334187eea97d2da"' }>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProductController.html" data-type="entity-link" >ProductController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link" >UserController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Product.html" data-type="entity-link" >Product</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/Auth.html" data-type="entity-link" >Auth</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseEntity.html" data-type="entity-link" >BaseEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAuthDto.html" data-type="entity-link" >CreateAuthDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProductDto.html" data-type="entity-link" >CreateProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginUserDto.html" data-type="entity-link" >LoginUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateAuthDto.html" data-type="entity-link" >UpdateAuthDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProductDto.html" data-type="entity-link" >UpdateProductDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateUserDto.html" data-type="entity-link" >UpdateUserDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmailService.html" data-type="entity-link" >EmailService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GoogleAuthGuard.html" data-type="entity-link" >GoogleAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GoogleAuthStrategy.html" data-type="entity-link" >GoogleAuthStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/KakaoAuthGuard.html" data-type="entity-link" >KakaoAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/KakaoAuthStrategy.html" data-type="entity-link" >KakaoAuthStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalAuthGuard.html" data-type="entity-link" >LocalAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalAuthStrategy.html" data-type="entity-link" >LocalAuthStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NaverAuthGuard.html" data-type="entity-link" >NaverAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NaverAuthStrategy.html" data-type="entity-link" >NaverAuthStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductService.html" data-type="entity-link" >ProductService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TokenGuard.html" data-type="entity-link" >TokenGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TokenStrategy.html" data-type="entity-link" >TokenStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/RequestUserInterface.html" data-type="entity-link" >RequestUserInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TokenInterface.html" data-type="entity-link" >TokenInterface</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});