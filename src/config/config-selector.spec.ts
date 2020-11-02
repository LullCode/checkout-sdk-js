import { CheckoutStoreState } from '../checkout';
import { getCheckoutStoreState } from '../checkout/checkouts.mock';

import { FlashMessage } from './config';
import ConfigSelector, { createConfigSelectorFactory, ConfigSelectorFactory } from './config-selector';
import ConfigState from './config-state';

describe('ConfigSelector', () => {
    let configSelector: ConfigSelector;
    let configStateWithMessages: ConfigState;
    let createConfigSelector: ConfigSelectorFactory;
    let state: CheckoutStoreState;

    beforeEach(() => {
        createConfigSelector = createConfigSelectorFactory();
        state = getCheckoutStoreState();
    });

    describe('#getConfig()', () => {
        it('returns the current config', () => {
            configSelector = createConfigSelector(state.config);

            expect(configSelector.getConfig()).toEqual(state.config.data);
        });

        it('returns the store config', () => {
            configSelector = createConfigSelector(state.config);

            // tslint:disable-next-line:no-non-null-assertion
            expect(configSelector.getStoreConfig()).toEqual(state.config.data!.storeConfig);
        });

        it('returns the context config', () => {
            configSelector = createConfigSelector(state.config);

            // tslint:disable-next-line:no-non-null-assertion
            expect(configSelector.getContextConfig()).toEqual(state.config.data!.context);
        });
    });

    describe('#getFlashMessages', () => {
        const flashMessages: FlashMessage[] = [
            { type: 'info', message: 'm_info', title: '' },
            { type: 'error', message: 'm_error', title: '' },
            { type: 'warning', message: 'm_warning', title: '' },
            { type: 'success', message: 'm_success', title: '' },
        ];

        beforeEach(() => {
            configStateWithMessages = {
                ...state.config,
                data: {
                    // tslint:disable-next-line: no-non-null-assertion
                    ...state.config.data!,
                    context: {
                        // tslint:disable-next-line: no-non-null-assertion
                        ...state.config.data!.context,
                        flashMessages,
                    },
                },
            };
        });

        it('returns all the flash messages', () => {
            configSelector = createConfigSelector(configStateWithMessages);

            expect(configSelector.getFlashMessages())
                .toEqual(flashMessages);
        });

        it('returns the flash message matching the provided filter', () => {
            configSelector = createConfigSelector(configStateWithMessages);

            expect(configSelector.getFlashMessages('error'))
                .toEqual([flashMessages[1]]);
        });

        it('returns empty array when no messages available', () => {
            configSelector = createConfigSelector(state.config);

            expect(configSelector.getFlashMessages())
                .toEqual([]);
        });
    });

    describe('#getExternalSource()', () => {
        it('returns the external source', () => {
            const externalSource = 'Partner';

            configSelector = createConfigSelector({
                ...state.config,
                meta: { externalSource },
            });

            expect(configSelector.getExternalSource()).toEqual(externalSource);
        });
    });

    describe('#getLoadingError()', () => {
        it('returns error if unable to load config', () => {
            const loadError = new Error();

            configSelector = createConfigSelector({
                ...state.config,
                errors: { loadError },
            });

            expect(configSelector.getLoadError()).toEqual(loadError);
        });

        it('does not returns error if able to load config', () => {
            configSelector = createConfigSelector(state.config);

            expect(configSelector.getLoadError()).toBeUndefined();
        });
    });

    describe('#isLoading()', () => {
        it('returns true if loading config', () => {
            configSelector = createConfigSelector({
                ...state.config,
                statuses: { isLoading: true },
            });

            expect(configSelector.isLoading()).toEqual(true);
        });

        it('returns false if not loading config', () => {
            configSelector = createConfigSelector(state.config);

            expect(configSelector.isLoading()).toEqual(false);
        });
    });
});
