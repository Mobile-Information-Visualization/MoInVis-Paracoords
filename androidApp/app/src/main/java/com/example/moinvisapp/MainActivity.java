package com.example.moinvisapp;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.JsResult;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        this.setContentView(R.layout.activity_main);

        WebView webView = findViewById(R.id.webview);
        /*webView.loadUrl("http://192.168.178.20:8888");*/
        webView.loadUrl("https://moin.vrsys.org");
        webView.clearCache(true);

        /*webView.addJavascriptInterface(new WebAppInterface(this), "AndroidInterface");*/
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        /*webView.setWebChromeClient(new MyWebChromeClient());*/
        webView.setWebViewClient(new WebViewClient());

        webView.getSettings().setLoadWithOverviewMode(true);
        webView.getSettings().setUseWideViewPort(true);
    }


    private class MyWebChromeClient extends WebChromeClient {
        @Override
        public boolean onJsAlert(WebView view, String url, String message, JsResult result) {
            return true;
        }
    }
}
